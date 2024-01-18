import { env } from "@/src/env.mjs";
import {
  createShaHash,
  verifySecretKey,
} from "@/src/features/public-api/lib/apiKeys";
import { type ApiAccessScope } from "@/src/features/public-api/server/types";
import { prisma } from "@/src/server/db";
import { instrumentAsync } from "@/src/utils/instrumentation";

export type AuthHeaderVerificationResult =
  | {
      validKey: true;
      scope: ApiAccessScope;
    }
  | {
      validKey: false;
      error: string;
    };

export async function verifyAuthHeaderAndReturnScope(
  authHeader: string | undefined,
): Promise<AuthHeaderVerificationResult> {
  return instrumentAsync(
    { name: "verifyAuthHeaderAndReturnScope" },
    async () => {
      if (!authHeader) {
        console.error("No authorization header");
        return {
          validKey: false,
          error: "No authorization header",
        };
      }

      try {

        console.log("DEBUG authHeader", authHeader)

        // Basic auth, full scope, needs secret key and public key
        if (authHeader.startsWith("Basic ")) {
          const { username: publicKey, password: secretKey } =
            extractBasicAuthCredentials(authHeader);


          //////////////////////////////// <EPOCH FORK ONLY> ////////////////////////////////
          // Special auth for epoch
          // TODO: Verify origin IP from the epoch API service to avoid a leaked
          // if secretKey does not match the env EPOCH_SECRET_KEY, throw error
            console.log("DEBUG secretKey", secretKey)
          if (secretKey == env.EPOCH_SECRET_KEY) {
            console.log("DEBUG INHERE")
            const projectId = publicKey;
            return {
              validKey: true,
              scope: {
                projectId: projectId,
                accessLevel: "all",
              },
            };
          }
          //////////////////////////////// </EPOCH FORK ONLY> ////////////////////////////////

          const salt = env.SALT;
          const hashFromProvidedKey = createShaHash(secretKey, salt);
          const apiKey = await prisma.apiKey.findUnique({
            where: { fastHashedSecretKey: hashFromProvidedKey },
          });
          let projectId = apiKey?.projectId;

          if (!apiKey || !apiKey.fastHashedSecretKey) {
            const dbKey = await findDbKeyOrThrow(publicKey);
            const isValid = await verifySecretKey(
              secretKey,
              dbKey.hashedSecretKey,
            );

            if (!isValid) {
              console.log("Old key is invalid", publicKey);
              throw new Error("Invalid credentials");
            }

            const shaKey = createShaHash(secretKey, salt);

            await prisma.apiKey.update({
              where: { publicKey },
              data: {
                fastHashedSecretKey: shaKey,
              },
            });
            projectId = dbKey.projectId;
          }

          if (!projectId) {
            console.log("No project id found for key", publicKey);
            throw new Error("Invalid credentials");
          }

          return {
            validKey: true,
            scope: {
              projectId: projectId,
              accessLevel: "all",
            },
          };
        }
        // Bearer auth, limited scope, only needs public key
        if (authHeader.startsWith("Bearer ")) {
          const publicKey = authHeader.replace("Bearer ", "");

          const dbKey = await findDbKeyOrThrow(publicKey);

          return {
            validKey: true,
            scope: {
              projectId: dbKey.projectId,
              accessLevel: "scores",
            },
          };
        }
      } catch (error: unknown) {
        console.error("Error verifying auth header: ", error);
        return {
          validKey: false,
          error: error instanceof Error ? error.message : "Authorization error",
        };
      }
      return {
        validKey: false,
        error: "Invalid authorization header",
      };
    },
  );
}

function extractBasicAuthCredentials(basicAuthHeader: string): {
  username: string;
  password: string;
} {
  const authValue = basicAuthHeader.split(" ")[1];
  if (!authValue) throw new Error("Invalid authorization header");

  const [username, password] = atob(authValue).split(":");
  if (!username || !password) throw new Error("Invalid authorization header");
  return { username, password };
}

async function findDbKeyOrThrow(publicKey: string) {
  const dbKey = await prisma.apiKey.findUnique({
    where: { publicKey },
  });
  if (!dbKey) {
    console.log("No api key found for public key:", publicKey);
    throw new Error("Invalid public key");
  }
  return dbKey;
}

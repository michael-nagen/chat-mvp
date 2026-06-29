import 'dotenv/config';
import { randomUUID } from 'crypto';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Standalone end-to-end check of the avatar S3 setup, mirroring the app's flow:
// presign a PUT → upload bytes via the presigned URL → read the public URL →
// delete the object → confirm it is gone. Run with: npm run verify:s3
//
// Validates exactly what the avatar feature needs:
//   - IAM credentials can presign + PUT + DELETE under avatars/*
//   - the bucket CORS/permissions accept the PUT
//   - the bucket policy serves avatars/* publicly (the stored avatarUrl works)

// 1x1 transparent PNG.
const PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var ${name} (set it in backend-nest/.env).`);
  }
  return value;
}

async function main(): Promise<void> {
  const region = requireEnv('AWS_REGION');
  const bucket = requireEnv('AWS_S3_BUCKET');
  requireEnv('AWS_ACCESS_KEY_ID');
  requireEnv('AWS_SECRET_ACCESS_KEY');
  const publicBase =
    process.env.AVATAR_PUBLIC_BASE_URL ??
    `https://${bucket}.s3.${region}.amazonaws.com`;

  const client = new S3Client({ region });
  const key = `avatars/__verify__/${randomUUID()}.png`;
  const body = Buffer.from(PNG_BASE64, 'base64');
  const contentType = 'image/png';

  console.log(`Bucket:     ${bucket} (${region})`);
  console.log(`Public base: ${publicBase}`);
  console.log(`Test key:   ${key}\n`);

  // 1) Presign a PUT (what POST /me/avatar/presign does).
  const uploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn: 300 },
  );
  console.log('1/5  ✓ presigned a PUT URL');

  // 2) Upload the bytes via the presigned URL (what the browser does).
  const put = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body,
  });
  if (!put.ok) {
    throw new Error(`PUT to presigned URL failed: ${put.status} ${put.statusText}`);
  }
  console.log('2/5  ✓ uploaded bytes to S3');

  // 3) Read the public URL with no credentials (what every <img> does).
  const publicUrl = `${publicBase}/${key}`;
  const get = await fetch(publicUrl);
  if (!get.ok) {
    throw new Error(
      `Public GET failed: ${get.status}. Check the bucket policy grants ` +
        `s3:GetObject on arn:aws:s3:::${bucket}/avatars/* and public access is allowed.`,
    );
  }
  console.log('3/5  ✓ object is publicly readable');

  // 4) Delete the object (what replace/remove does).
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  console.log('4/5  ✓ deleted the object');

  // 5) Confirm it is gone.
  const gone = await fetch(publicUrl);
  if (gone.ok) {
    throw new Error('Object still readable after delete.');
  }
  console.log('5/5  ✓ object no longer readable\n');
  console.log('S3 avatar setup is working end to end. 🎉');
}

main().catch((error) => {
  console.error('\n✗ S3 verification failed:\n', error instanceof Error ? error.message : error);
  process.exit(1);
});

// Result of issuing a presigned upload: the URL the browser PUTs the file to,
// the object key the client must echo back on commit, and the final public URL.
export interface PresignedAvatarUpload {
  uploadUrl: string;
  key: string;
  publicUrl: string;
}

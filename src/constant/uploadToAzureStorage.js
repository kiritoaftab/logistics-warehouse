import { ContainerClient } from "@azure/storage-blob";

const uploadToAzureStorage = async (file, blobName) => {
  const sasUrl = import.meta.env.VITE_APP_BLOB_SAS_URL;
  const containerName = import.meta.env.VITE_APP_CONTAINER_NAME;

  if (!sasUrl) throw new Error("Missing VITE_APP_BLOB_SAS_URL");
  if (!containerName) throw new Error("Missing VITE_APP_CONTAINER_NAME");

  const containerClient = new ContainerClient(sasUrl);

  const uuid = generateUUID();
  const safeBlobName = String(blobName || file.name).replace(/^\/+/, "");
  const finalBlobPath = `${uuid}-${safeBlobName}`;

  const blobClient = containerClient.getBlockBlobClient(finalBlobPath);

  await blobClient.uploadData(file, {
    blobHTTPHeaders: {
      blobContentType: file.type || "application/octet-stream",
    },
  });

  console.log("image saved successfully");
  console.log(blobClient?.url);

  return blobClient.url;
};

function generateUUID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-4" +
    s4().substr(0, 3) +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
}

export default uploadToAzureStorage;

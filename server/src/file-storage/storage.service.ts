import { glob } from "glob";
import { rename, rm } from "fs/promises";

const generateFileName = (file?: Express.Multer.File): string => {
  const extension = file?.originalname.split(".").pop();

  return `${Date.now()}.${extension}`;
};

const deleteFilesByIds = async (storageDirectory: string, ids: string[]) => {
  await Promise.all(
    ids.map((id) =>
      glob(`${storageDirectory}/${id}-*`).then((files) =>
        Promise.all(files.map((file) => rm(file)))
      )
    )
  );
};

const saveResourceFile = async (
  storageDirectory: string,
  resourceId: string,
  file: Express.Multer.File,
  fileName?: string
) => {
  const newFileName = fileName ?? generateFileName(file);

  await rename(file.path, `${storageDirectory}/${resourceId}-${newFileName}`);
};

const replaceResourceFile = async (
  storageDirectory: string,
  resourceId: string,
  file: Express.Multer.File,
  fileName: string
) => {
  await glob(`${storageDirectory}/${resourceId}-*`).then((files) =>
    Promise.all(files.map((fileName) => fileName !== file.path && rm(fileName)))
  );

  await saveResourceFile(storageDirectory, resourceId, file, fileName);
};

const getFileDirectory = async (
  storageDirectory: string,
  resourceId: string,
  fileName?: string
) => {
  const fullFileName =
    fileName ?? (await getFileName(storageDirectory, resourceId));

  return `${storageDirectory}/${resourceId}-${fullFileName}`;
};

const getFileName = async (storageDirectory: string, resourceId: string) => {
  const rawPath = (await glob(`${storageDirectory}/${resourceId}*`))[0];

  return rawPath.replace(`${storageDirectory}/${resourceId}-`.slice(2), "");
};

export default {
  generateFileName,
  deleteFilesByIds,
  saveResourceFile,
  replaceResourceFile,
  getFileDirectory,
};
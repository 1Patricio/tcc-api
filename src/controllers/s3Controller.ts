import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from "../config/awsConfig.js";

type File = {
  fileName: string,
  fileType: string,
  buffer: string
}

// Upload de arquivo
export const uploadFile = async ({ fileName, fileType, buffer } : File) => {

  const filenamecrypt = Date.now() + fileName

  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filenamecrypt, // cuidado
        Body: Buffer.from(buffer),
        ContentType: fileType,
      },
    });

    await upload.done();

    return {
      success: true,
      message: "Arquivo enviado com sucesso",
      data: {
        fileName: fileName,
        fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
        key: filenamecrypt, // cuidado - usa no buscar
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Erro ao fazer upload do arquivo",
      error: error.message,
    };
  }
};

// Excluir arquivo
export const deleteFile = async (fileName: string) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    });

    await s3Client.send(command);

    return {
      success: true,
      message: "Arquivo excluído com sucesso",
      data: {
        fileName: fileName,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Erro ao excluir arquivo",
      error: error.message,
    };
  }
};

// Buscar arquivo
export const getFile = async (filename: string) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename, // que seria o crypt
    });

    const response = await s3Client.send(command);
    
    return {
      success: true,
      message: "Arquivo encontrado com sucesso",
      data: {
        filename: filename,
        body: response.Body,
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        lastModified: response.LastModified,
        etag: response.ETag,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Erro ao buscar arquivo",
      error: error.message,
    };
  }
};
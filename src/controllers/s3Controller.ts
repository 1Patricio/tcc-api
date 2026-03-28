import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from '../config/awsConfig';

type File = {
  fileName: string,
  fileNameKey: string,
  fileType: string,
  buffer: Buffer
}

export const uploadFile = async ({ fileName, fileNameKey, fileType, buffer } : File) => {
  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileNameKey, 
        Body: buffer,
        ContentType: fileType,
      },
    });

    await upload.done();

    return {
      success: true,
      message: "Arquivo enviado com sucesso",
      data: {
        fileName: fileName,
        fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileNameKey}`,
        key: fileNameKey,
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
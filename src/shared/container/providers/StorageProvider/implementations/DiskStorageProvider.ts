import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/upload';


class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      // pega o nome do arquivo
      path.resolve(uploadConfig.tmpFolder, file),
      // move para a pasta uploads
      path.resolve(uploadConfig.uploadsFolder, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);

    // busca pelo arquivo, se existir, sai do try e deleta o arquivo, senao retorna
    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

export default DiskStorageProvider;

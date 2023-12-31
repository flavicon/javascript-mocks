import User from "./user.js";
import { readFile } from "fs/promises";
import { error } from './constants.js';

const DEFAULT_OPTIONS = {
  maxLines: 3,
  fields: ['id', 'name', 'profession', 'age']
}

class File {
  static async csvToJson(filePath) {
    const content = await File.getFileContent(filePath);
    const validation = File.isValid(content);

    if (!validation.valid) throw new Error(validation.error);

    const result = File.parseToJson(content);
    return result;
  }

  static async getFileContent(filePath) {
    return (await readFile(filePath)).toString('utf-8');
  }

  static isValid(csvString, options = DEFAULT_OPTIONS) {
    const [header, ...fileWithoutHeader] = csvString.split('\n');
    const isHeaderValid = header === options.fields.join(',');
    const isContentLengthAccepted = (
      fileWithoutHeader.length > 0 && fileWithoutHeader.length <= options.maxLines
    )

    if (!isHeaderValid) {
      return {
        error: error.FILE_FIELDS_ERROR_MESSAGE,
        valid: false,
      }
    }

    if (!isContentLengthAccepted) {
      return {
        error: error.FILE_LENGTH_ERROR_MESSAGE,
        valid: false,
      }
    }

    return {
      valid: true,
    }
  }

  static parseToJson(csvString) {
    const lines = csvString.split('\n');
    const firstLine = lines.shift();
    const header = firstLine.split(',');

    const users = lines.map((line) => {
      const columns = line.split(',');
      const user = {};

      for (const index in columns) {
        user[header[index]] = columns[index];
      }

      return new User(user);
    });

    return users;
  }
}

export default File;
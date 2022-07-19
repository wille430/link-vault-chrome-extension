import { API_URL } from "../constants";
import { ICrudClient } from "./ICrudClient";

export class CrudClient<T> implements ICrudClient<T> {
  private readonly path: string;

  constructor(path: string) {
    this.path = path;
  }

  get apiUrl() {
    return new URL(this.path, API_URL);
  }

  async create(link: any): Promise<T> {
    return fetch(this.apiUrl, {
      method: "POST",
      body: JSON.stringify(link),
    }).then(async (res) => await res.json());
  }
  async getAll(): Promise<T[]> {
    return fetch(this.apiUrl).then(async (res) => await res.json());
  }
  async getById(id: string): Promise<T> {
    return fetch(new URL(id, this.apiUrl)).then(
      async (res) => await res.json()
    );
  }
  async delete(id: string): Promise<void> {
    fetch(new URL(id, this.apiUrl), {
      method: "DELETE",
    }).then(async (res) => await res.json());
  }
  async put(id: string, link: Partial<T>): Promise<void> {
    fetch(new URL(id, this.apiUrl), {
      method: "PUT",
      body: JSON.stringify(link),
    }).then(async (res) => await res.json());
  }
}


export interface ICrudClient<T> {
    create(link: any): Promise<T>;
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T>;
    delete(id: string): Promise<void>;
    put(id: string, link: Partial<T>): Promise<void>;
}

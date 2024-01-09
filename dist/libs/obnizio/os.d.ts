export default class OS {
    static list(hardware: string, type?: string | null): Promise<any>;
    static hardwares(type?: string | null): Promise<any>;
    static latestPublic(hardware: string): Promise<any>;
    static os(hardware: string, version: string): Promise<any>;
    static prepareLocalFile(hardware: string, version: string, progress: (progress: string) => void): Promise<{
        app_path: string;
        bootloader_path: string;
        partition_path: string;
    }>;
}

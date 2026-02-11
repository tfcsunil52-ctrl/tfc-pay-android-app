/**
 * Resolves an asset path with the correct base URL.
 * @param path The absolute path to the asset (e.g., "/images/logo.png")
 * @returns The resolved path including the base URL
 */
export const getAssetPath = (path: string) => {
    try {
        // If it's an external URL, return as is
        if (path.startsWith('http')) {
            return path;
        }

        // Get base URL from Vite environment
        const baseUrl = import.meta.env.BASE_URL;

        // If path starts with /, remove the leading slash to join correctly
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;

        // BaseURL usually ends with /, so just append cleanPath
        return `${baseUrl}${cleanPath}`;
    } catch (error) {
        console.error("Error resolving asset path:", error);
        return path;
    }
};

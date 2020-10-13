function resolveUrl(url, base, search_params_to_delete = []) {
    if (!url) return undefined;

    try {
        const u = new URL(url, base);
        if (search_params_to_delete && search_params_to_delete.length > 0) {
            for (const sp of search_params_to_delete) u.searchParams.delete(sp);
        }
        return u.href;
    } catch (_) {
        return undefined;
    }
}

module.exports = { resolveUrl };

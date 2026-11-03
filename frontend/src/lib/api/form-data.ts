export function appendFormValues(fd: FormData, values: Record<string, unknown>) {
  Object.entries(values).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (typeof value === "number" && Number.isNaN(value)) return;
    if (typeof value === "boolean") {
      fd.append(key, value ? "1" : "0");
      return;
    }
    fd.append(key, String(value));
  });
}

const imageModules = import.meta.glob('@assets/**/*.{png,jpg,jpeg}', { 
  eager: true,
  import: 'default' 
}) as Record<string, string>;

const imageCache = new Map<string, string>();

Object.entries(imageModules).forEach(([path, url]) => {
  const fileName = path.split('/').pop()?.split('_')[0] || '';
  const cleanName = fileName.toUpperCase();
  imageCache.set(cleanName, url);
});

export function getVehicleImage(modelName: string): string | null {
  const cleanModelName = modelName.toUpperCase().trim();
  return imageCache.get(cleanModelName) || null;
}

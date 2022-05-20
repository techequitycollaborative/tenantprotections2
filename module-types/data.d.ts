declare module '@/data/zipcodes.json' {
  type ZipData = import('../types/location').ZipData;
  const data: Record<string, ZipData>;
  export default data;
}

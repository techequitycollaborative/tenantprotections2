import moratoria from '@/data/moratoria.json';

function activeMoratorium(
  city: string,
  date: Date,
): { isActive: boolean; cap: number | null } {
  const cityData = moratoria[city as keyof typeof moratoria];

  if (cityData) {
    const start = new Date(cityData.start + 'T00:00:00');
    const end = new Date(cityData.end + 'T00:00:00');

    if (date >= start && date <= end) {
      return { isActive: true, cap: cityData.max_increase };
    }
  }

  return { isActive: false, cap: null };
}

export { activeMoratorium };

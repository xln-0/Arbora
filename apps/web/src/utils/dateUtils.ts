export function formatDate(date?: string | Date | null) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("fr-FR").format(new Date(date));
}

export function toInputDate(date?: string | Date | null) {
  if (!date) {
    return "";
  }

  return new Date(date).toISOString().split("T")[0];
}

export function formatPersonLifespan(
  birthDate?: string,
  deathDate?: string,
): string {
  if (!birthDate) {
    return "";
  }

  const birth = new Date(birthDate);

  const birthYear = birth.getFullYear();

  if (!deathDate) {
    return formatDate(birthDate);
  }

  const death = new Date(deathDate);

  return `${birthYear} - ${death.getFullYear()}`;
}

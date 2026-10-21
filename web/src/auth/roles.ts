/** App roles, matching CtaTraining.Domain.Security.AppRoles on the API. */
export const Roles = {
  Employee: 'Employee',
  Trainer: 'Trainer',
  Admin: 'Admin',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export const allRoles: readonly Role[] = [Roles.Employee, Roles.Trainer, Roles.Admin];

export function hasAnyRole(userRoles: readonly string[], required: readonly Role[]): boolean {
  return required.length === 0 || required.some((role) => userRoles.includes(role));
}

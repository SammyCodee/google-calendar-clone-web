export type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T,K> : never

/**
 * 'T extends unknown' here will distribute the union and split it into all different parts
 * like mix with {allDay: false ...} and {allDay: true ... }
 */
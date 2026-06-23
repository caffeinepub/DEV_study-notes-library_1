import { format, formatDistanceToNow } from "date-fns";

export function fromNanoseconds(timestamp: bigint): Date {
  return new Date(Number(timestamp / 1_000_000n));
}

export function formatDate(timestamp: bigint): string {
  return format(fromNanoseconds(timestamp), "MMM d, yyyy");
}

export function formatDateWithTime(timestamp: bigint): string {
  return format(fromNanoseconds(timestamp), "MMM d, yyyy h:mm a");
}

export function formatRelativeDate(timestamp: bigint): string {
  return formatDistanceToNow(fromNanoseconds(timestamp), { addSuffix: true });
}

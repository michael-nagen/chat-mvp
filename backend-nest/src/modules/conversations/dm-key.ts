// Single owner of the DM pair-key format. The unique `dmKey` index relies on
// this being order-independent, so anything that writes a DM (service, seed)
// must derive the key here rather than re-implementing the formula.
export const toDmKey = (participantIds: string[]): string =>
  [...participantIds].sort().join(':');

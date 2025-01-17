export type CustomerRelationship = {
  relatedCustomerId: number,
  relationType: "P2P_SEND" | "P2P_RECEIVE" | "DEVICE"
}
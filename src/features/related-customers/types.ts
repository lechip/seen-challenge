export enum RelationType {
  P2P_SEND = "P2P_SEND",
  P2P_RECEIVE = "P2P_RECEIVE",
  DEVICE = "DEVICE",
}

export type CustomerRelationship = {
  relatedCustomerId: number,
  relationType: RelationType
}
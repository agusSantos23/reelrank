export interface DecodedToken {
  email: string;
  exp: number;
  iat: number;
  id: string;
  iss: string;
  jti: string;
  nbf: number;
  prv: string;
  sub: string;
}
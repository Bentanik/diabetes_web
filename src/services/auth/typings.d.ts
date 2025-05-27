declare namespace REQUEST {
  type TSendRegisterEmail = {
    fullName: string;
    email: string;
  };

  type TVerifyRegisterEmail = {
    otp: string;
  };

  type TRegisterEmail = {
    otp: string;
    password: string;
  };

  type TLogin = {
    email: string;
    password: string;
  };
}

declare namespace API {
  type TAuthTokenDto = {
    accessToken?: string | null;
    refreshToken?: string | null;
    tokenType?: string | null;
  };

  type TAuthUserDto = {
    id?: string | null;
    email?: string | null;
    fullName?: string | null;
    avatarUrl?: string | null;
    roleName?: number | null;
  };

  type TLoginResponseDto = {
    authUser: TAuthUserDto;
    authToken: TAuthTokenDto;
  };

  type TLoginResponse = {
    responses: TLoginResponseDto;
  };
}

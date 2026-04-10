import { ApiProperty } from '@nestjs/swagger';

export class UploadFileBodyDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Arquivo enviado no campo file',
  })
  file: any;
}

export class UploadResponseDataDto {
  @ApiProperty({
    example: 'https://res.cloudinary.com/demo/image/upload/v1/uploads/avatar.jpg',
  })
  url: string;
}

export class UploadSuccessResponseDto {
  @ApiProperty({ example: 201 })
  status: number;

  @ApiProperty({ example: 'file uploaded successfully' })
  message: string;

  @ApiProperty({ type: UploadResponseDataDto })
  response: UploadResponseDataDto;
}

export class UploadErrorResponseDto {
  @ApiProperty({ example: 500 })
  status: number;

  @ApiProperty({ example: 'Internal server error' })
  message: string;
}

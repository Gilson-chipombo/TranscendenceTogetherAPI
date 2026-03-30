import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsOptional, IsString } from "class-validator";

export class CreateRoomDto {
    @ApiProperty({
        description: 'Name of the room',
        example: 'Transcendence',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The host ID of the room',
        example: '085b4945-5229-4ba9-befe-664320156f42',
    })
    @IsString()
    hostId: string;

     @ApiProperty({
        description: 'Title of move watch in de room',
        example: 'O mochileiro das galaxias'
    })
    @IsString()
    title: string;

    @ApiProperty({
        description: 'The start date and time of the room',
        example: '2026-03-21T13:38:02.410Z',
        type: String, //data no formato ISO 8601
    })
    @IsDateString()
    dataInicio: string;

    @ApiProperty({
        description: 'Indicates whether the room is private',
        example: true,
        type: Boolean
    })
    @IsOptional()
    @IsBoolean()
    isPrivate: boolean;

    @ApiProperty({
        description: 'The end date and time of the room',
        example: '2026-03-20T13:38:02.410Z',
        type: String,
    })
    @IsOptional()
    @IsDateString()
    dataTermino: string;
}

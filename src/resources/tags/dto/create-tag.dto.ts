export class CreateTagDto {
  musicId: number;
  tagName: string;
  valueType: 'number' | 'string';
  value: number | string;
}

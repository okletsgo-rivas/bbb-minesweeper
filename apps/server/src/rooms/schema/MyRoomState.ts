import { Schema, ArraySchema, Context, type } from "@colyseus/schema";

export class MyRoomState extends Schema {
  @type(["string"]) messages = new ArraySchema<string>();
}

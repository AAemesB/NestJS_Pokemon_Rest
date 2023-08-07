import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Pokemon extends Document {

    //id: string; Mongo ya asignara el ID

    @Prop({
        unique: true,
        index: true
    })
    nombre: string;

    @Prop({
        unique: true,
        index: true
    })
    no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);

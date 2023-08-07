import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {


  constructor (
    
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
    
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    
    createPokemonDto.nombre = createPokemonDto.nombre.toLocaleLowerCase();

    try {
    
      const pokemon = await this.pokemonModel.create(createPokemonDto); 
      return pokemon;

    } catch (error) {

      this.handleException(error)

    }

    
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    
    let pokemon: Pokemon;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({no: term});
    }


    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({name: term.toLocaleLowerCase().trim()});
    }

    if (!pokemon) throw new NotFoundException (`Pokemon con id ${term} no encontrado`)


    return pokemon;

  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {


    const pokemon = await this.findOne(term);

    if (updatePokemonDto.nombre) updatePokemonDto.nombre = updatePokemonDto.nombre.toLocaleLowerCase()

    try {

      await pokemon.updateOne(updatePokemonDto)
      return {...pokemon.toJSON(), updatePokemonDto};
      
    } catch (error) {

      this.handleException(error)
      
    }

   
  }

  async remove(id: string) {
    
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();

    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});

    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon con id ${id} no encontrado`)
    }

  }


  private handleException (error: any) {
 
    if (error.code === 11000) {
      throw new BadRequestException(`El pokemon existe en db ${JSON.stringify(error.keyValue)}`);
    }

    console.log(error);
    throw new InternalServerErrorException(`No se puede crear Pokemon Check Server Logs`);

  }
}

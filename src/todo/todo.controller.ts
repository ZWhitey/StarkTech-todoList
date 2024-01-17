import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

class GetParams {
  @ApiProperty()
  owner: string;
  @ApiProperty()
  assignee: string;
  @ApiPropertyOptional()
  startDate: Date;
  @ApiPropertyOptional()
  endDate: Date;
}
@ApiBearerAuth()
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() createTodoDto: CreateTodoDto) {
    const userId = new Types.ObjectId(req.user.sub);
    if (createTodoDto.parent) {
      createTodoDto.parent = new Types.ObjectId(createTodoDto.parent);
    }
    return this.todoService.create({ owner: userId, ...createTodoDto });
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req, @Query() parms: GetParams) {
    let ownerId, assigneeId;
    if (typeof parms.owner === 'string') {
      ownerId = new Types.ObjectId(parms.owner.toString());
    }
    if (typeof parms.assignee === 'string') {
      assigneeId = new Types.ObjectId(parms.assignee.toString());
    }
    if (parms.startDate) {
      parms.startDate = new Date(parms.startDate.toString());
    }
    if (parms.endDate) {
      parms.endDate = new Date(parms.endDate.toString());
    }
    return this.todoService.findAll(
      ownerId,
      assigneeId,
      parms.startDate,
      parms.endDate,
    );
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(new Types.ObjectId(id));
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    const userId = new Types.ObjectId(req.user.sub);
    const todo = await this.todoService.findOne(new Types.ObjectId(id));
    if (
      !userId.equals(todo.owner) &&
      todo.assignee.some((assignee) => assignee !== userId)
    ) {
      throw new Error('Not authorized');
    }
    return this.todoService.update(new Types.ObjectId(id), updateTodoDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const userId = new Types.ObjectId(req.user.sub);
    const todo = await this.todoService.findOne(new Types.ObjectId(id));
    if (!userId.equals(todo.owner)) {
      throw new Error('Not authorized');
    }
    return this.todoService.remove(new Types.ObjectId(id));
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { ObjectId } from 'mongodb';
import { RoomsDocument } from '../src/rooms/models/rooms.models';
import { ScheduleDocument } from 'src/schedule/models/schedule.models';
import { customValidator } from '../src/common/validators/custom.validator';
import { Types } from 'mongoose';

// import { RoomsDocument } from 'src/rooms/models/rooms.models';
// import { Types } from 'mongoose';

// interface ErrorResponse {
//   message: string[]; // Массив сообщений об ошибках
//   error: string;
//   statusCode: number;
// }
export interface ErrorResponse {
  statusCode: number;
  message: Array<{
    property: string;
    constraints: {
      isEmail?: string;
    };
  }>;
  error: string;
}
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let numberRoom: number;
  let roomId: string;
  let scheduleId: string;
  const admin = {
    _id: '',
    email: 'a@a.ru',
    password: 'aaa',
    name: 'Ruslan',
    phone: '+7 (111) 111-11-11',
    role: 'admin',
  };
  const newUser1 = {
    _id: '',
    email: 'q@q.ru',
    password: 'qqq',
    name: 'Alina',
    phone: '+7 (777) 777-77-77',
    role: 'user',
  };

  const newUser2 = {
    _id: '',
    email: '1@1.ru',
    password: '111',
    name: 'Tolya',
    phone: '+7 (222) 222-22-22',
    role: 'user',
  };

  let jwtUser1: string = '';
  let jwtUser2: string = '';
  let jwtAdmin: string = '';
  const notValidJwt = '12121';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        exceptionFactory: customValidator,
      }),
    );
    await app.init();
  });
  it('POST /users/create should return 400 Bad Request when email not valid', async () => {
    const requestBody = {
      email: 'qq.ru',
      password: '123',
      name: 'Alina',
      phone: '+7 (999) 999-99-99',
    };
    const response = await request(app.getHttpServer())
      .post('/users/create')
      .send(requestBody)
      .expect(400);
    expect(JSON.stringify(response.body)).toContain('Введите корректный email');
  });
  it('POST /users/create should return 400 Bad Request when request empty', async () => {
    const requestBody = {
      email: '',
      password: '',
      name: '',
      phone: '',
    };
    return await request(app.getHttpServer())
      .post('/users/create')
      .send(requestBody)
      .expect(400);
  });
  it('POST /users/create should return 201 create new accaunt ADMIN', async () => {
    const { email, password, name, phone, role } = admin;
    const response = await request(app.getHttpServer())
      .post('/users/create')
      .send({ email, password, name, phone, role })
      .expect(201);
    const typedResponse = response.body as { id: Types.ObjectId };
    newUser1._id = String(typedResponse.id);
  });
  it('POST /users/create should return 201 create new accaunt with role user.USER1', async () => {
    const { email, password, name, phone, role } = newUser1;
    const response = await request(app.getHttpServer())
      .post('/users/create')
      .send({ email, password, name, phone, role })
      .expect(201);
    const typedResponse = response.body as { id: Types.ObjectId };
    newUser1._id = String(typedResponse.id);
  });
  it('POST /users/create should return 201 create new accaunt with role user.USER2', async () => {
    const { email, password, name, phone, role } = newUser2;
    const response = await request(app.getHttpServer())
      .post('/users/create')
      .send({ email, password, name, phone, role })
      .expect(201);
    const typedResponse = response.body as { id: Types.ObjectId };
    newUser2._id = String(typedResponse.id);
  });
  it('POST /auth/login should return 400 Bad Request when wrong password', async () => {
    const email = newUser1.email;
    const password = '111';
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(400);

    expect(JSON.stringify(response)).toContain('Неверный пароль');
  });
  it('POST /auth/login should return 201 when successful registration ADMIN', async () => {
    const email = 'a@a.ru';
    const password = 'aaa';
    interface AuthResponse {
      token_access: string;
    }
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(201)
      .then(({ body }: request.Response) => {
        const jwt = body as AuthResponse;
        console.log(jwt.token_access);

        jwtAdmin = jwt.token_access;
      });
  });
  it('POST /auth/login should return 201 when successful registration', async () => {
    const email = newUser1.email;
    const password = newUser1.password;
    interface AuthResponse {
      token_access: string;
    }
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(201)
      .then(({ body }: request.Response) => {
        const jwt = body as AuthResponse;
        jwtUser1 = jwt.token_access;
      });
  });
  it('POST /auth/login should return 201 when successful registration', async () => {
    const email = newUser2.email;
    const password = newUser2.password;
    interface AuthResponse {
      token_access: string;
    }
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(201)
      .then(({ body }: request.Response) => {
        const jwt = body as AuthResponse;
        jwtUser2 = jwt.token_access;
      });
  });
  it('GET /users/readAll should return 401 when did pass jwt not admin', async () => {
    return await request(app.getHttpServer())
      .get('/users/readAll')
      .set({ Authorization: `Bearer ${jwtUser1}` })
      .expect(401);
  });
  it('GET /users/readAll should return 200 when did pass jwt not admin', async () => {
    return await request(app.getHttpServer())
      .get('/users/readAll')
      .set({ Authorization: `Bearer ${jwtAdmin}` })
      .expect(200);
  });
  it('GET /users/read/:id should return 401 when passed the wrong jwt', async () => {
    return await request(app.getHttpServer())
      .get(`/users/read/${newUser1._id}`)
      .set('Authorization', `Bearer ${notValidJwt}`)
      .expect(401);
  });
  it('GET /users/read/:id should return 403 when you passed jwt to another user', async () => {
    return await request(app.getHttpServer())
      .get(`/users/read/${newUser1._id}`)
      .set('Authorization', `Bearer ${jwtUser2}`)
      .expect(403);
  });
  it('GET /users/read/:id should return 200 ', async () => {
    return await request(app.getHttpServer())
      .get(`/users/read/${newUser1._id}`)
      .set('Authorization', `Bearer ${jwtUser1}`)
      .expect(200);
  });
  it('POST /rooms/create should return 400 Bad Request when request body has empty fields', async () => {
    const requestBody = {
      room: '',
      roomType: '',
    };
    return await request(app.getHttpServer())
      .post('/rooms/create')
      .set('Authorization', `Bearer ${jwtAdmin}`)
      .send(requestBody)
      .expect(400);
  });
  it('POST /rooms/create should return 400 Bad Request when not valid fields roomType', async () => {
    const requestBody = {
      room: '1',
      roomType: 'Suite1',
    };
    return await request(app.getHttpServer())
      .post('/rooms/create')
      .set('Authorization', `Bearer ${jwtAdmin}`)
      .send(requestBody)
      .expect(400);
  });
  it('POST /rooms/create should return 403 when when transferred user jwt', async () => {
    const requestBody = {
      room: 35,
      roomType: 'Single',
    };
    return await request(app.getHttpServer())
      .post('/rooms/create')
      .set('Authorization', `Bearer ${jwtUser1}`)
      .set('Content-Type', 'application/json')
      .send(requestBody)
      .expect(401);
  });
  it('POST /rooms/create should return 201 when the Room object is created in the database ', async () => {
    const requestBody = {
      room: 35,
      roomType: 'Single',
    };
    return await request(app.getHttpServer())
      .post('/rooms/create')
      .set('Authorization', `Bearer ${jwtAdmin}`)
      .set('Content-Type', 'application/json')
      .send(requestBody)
      .expect(201)
      .then(({ body }: { body: RoomsDocument }) => {
        roomId = body._id.toString();
        numberRoom = body.room;
      });
  });
  it('POST /schedule/create/ should return 400 Bad Request when not valid fields roomId', async () => {
    const date = { date: '2025-06-23' };
    const id = 'invalid-room-id';
    return await request(app.getHttpServer())
      .post(`/schedule/create/${id}`)
      .set('Authorization', `Bearer ${jwtUser1}`)
      .set('Content-Type', 'application/json')
      .send(date)
      .expect(400)
      .then(({ body }: { body: ErrorResponse }) => {
        expect(body.message).toEqual(
          'Validation failed for field "id": id must be a mongodb id',
        );
      });
  });
  it('POST /schedule/create/ should return 400 Bad Request when not valid fields date', async () => {
    const date = { date: '2121' };
    const id = new ObjectId().toString();
    return await request(app.getHttpServer())
      .post(`/schedule/create/${id}`)
      .set('Authorization', `Bearer ${jwtUser1}`)
      .set('Content-Type', 'application/json')
      .send(date)
      .expect(400);
  });
  it('POST /schedule/create/ should return 201 when booking is created in the database', async () => {
    const date = { date: '2025-06-23' };
    const id = roomId;
    return await request(app.getHttpServer())
      .post(`/schedule/create/${id}`)
      .set('Authorization', `Bearer ${jwtUser1}`)
      .set('Content-Type', 'application/json')
      .send(date)
      .expect(201)
      .then(({ body }: { body: ScheduleDocument }) => {
        scheduleId = body._id.toString();
      });
  });

  it('PATCH /schedule/updateDate/ should return 409 when the date of the room reservation is taken', async () => {
    const data = { roomId: roomId, date: '2025-06-23' };
    const response = await request(app.getHttpServer())
      .patch(`/schedule/updateDate/${scheduleId}`)
      .set('Authorization', `Bearer ${jwtUser1}`)
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(409);
    expect(JSON.stringify(response)).toContain(
      'Room is already booked for this date',
    );
  });
  it('PATCH /schedule/updateDate/ should return 409 when try change schedule another user', async () => {
    const data = { roomId: roomId, date: '2025-01-23' };
    const res: { body: ErrorResponse } = await request(app.getHttpServer())
      .patch(`/schedule/updateDate/${scheduleId}`)
      .set('Authorization', `Bearer ${jwtUser2}`)
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(404);
    expect(JSON.stringify(res.body.message)).toContain(
      'Schedule with number room',
    );
  });
  it('PATCH /schedule/updateDate/ should return 409 when the date of the room reservation is taken', async () => {
    const data = { roomId: roomId, date: '2025-01-23' };
    return await request(app.getHttpServer())
      .patch(`/schedule/updateDate/${scheduleId}`)
      .set('Authorization', `Bearer ${jwtUser1}`)
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(200);
  });
  it('DELETE /schedule/deleteBooking/:scheduleId should return 400 Bad Request when not valid fields scheduleId', async () => {
    const id = 'not_valid_id';
    return await request(app.getHttpServer())
      .delete(`/schedule/deleteBooking/${id}`)
      .set('Authorization', `Bearer ${jwtUser1}`)
      .expect(400);
  });
  it('DELETE /schedule/deleteBooking/:scheduleId should return 400 Bad Request when not found scheduleId', async () => {
    const id = new ObjectId().toHexString();
    return await request(app.getHttpServer())
      .delete(`/schedule/deleteBooking/${id}`)
      .set('Authorization', `Bearer ${jwtUser1}`)
      .expect(404);
  });
  it('DELETE /schedule/deleteBooking/:scheduleId should 204 successfully deletes and returns the deleted schedule with 204 OK', async () => {
    const id = scheduleId;
    return await request(app.getHttpServer())
      .delete(`/schedule/deleteBooking/${id}`)
      .set('Authorization', `Bearer ${jwtUser1}`)
      .expect(204);
  });
  it('POST /schedule/create/ should return 201 when booking is created in the database', async () => {
    const date = { date: '2025-06-23' };
    const id = roomId;
    return await request(app.getHttpServer())
      .post(`/schedule/create/${id}`)
      .set('Authorization', `Bearer ${jwtUser1}`)
      .set('Content-Type', 'application/json')
      .send(date)
      .expect(201)
      .then(({ body }: { body: ScheduleDocument }) => {
        scheduleId = body._id.toString();
      });
  });
  it('POST /rooms/create should return 409  Conflict when an attempt was made to add an existing room', async () => {
    const requestBody = {
      room: numberRoom,
      roomType: 'Single',
    };
    return await request(app.getHttpServer())
      .post('/rooms/create')
      .set('Authorization', `Bearer ${jwtAdmin}`)
      .set('Content-Type', 'application/json')
      .send(requestBody)
      .expect(409);
  });

  it('GET /rooms/read return 400 should accept numeric query parameters', async () => {
    return request(app.getHttpServer())
      .get('/rooms/read')
      .query({ limit: 'qqq' })
      .expect(400);
  });

  it('GET /rooms/read return 200 when data arrived successfully', async () => {
    return await request(app.getHttpServer())
      .get('/rooms/read')
      .query({ page: 1, limit: 10 })
      .expect(200);
  });

  it('PATCH /rooms/update return 400 Bad Request when request body has empty fields', () => {
    const requestBody = {};
    return request(app.getHttpServer())
      .patch('/rooms/update')
      .set('Authorization', `Bearer ${jwtAdmin}`)
      .send(requestBody)
      .expect(400);
  });
  it('PATCH /rooms/update return 401 ', () => {
    const requestBody = {};
    return request(app.getHttpServer())
      .patch('/rooms/update')
      .set('Authorization', `Bearer ${jwtUser1}`)
      .send(requestBody)
      .expect(401);
  });
  it('PATCH /rooms/update  should return 400 Bad Request when not valid fields roomType', () => {
    const requestBody = {
      roomId: new ObjectId().toString(),
      roomType: 'Suite1',
    };
    return request(app.getHttpServer())
      .patch('/rooms/update')
      .set('Authorization', `Bearer ${jwtAdmin}`)
      .send(requestBody)
      .expect(400);
  });

  it('PATCH /rooms/update  should return 200 successful data update', () => {
    const requestBody = {
      roomId: roomId,
      roomType: 'Suite',
    };
    return request(app.getHttpServer())
      .patch('/rooms/update')
      .set('Authorization', `Bearer ${jwtAdmin}`)
      .set('Content-Type', 'application/json')
      .send(requestBody)
      .expect(200);
  });

  // it('DELETE /rooms/delete/:id should return 404 not found id for delete', async () => {
  //   const id = new ObjectId().toString(); // Создаем валидный ObjectId
  //   // console.log(`Attempting to delete room with non-existent ID: ${id}`);

  //   // // Убедитесь, что комнаты с таким ID нет в базе данных (просто чтобы наверняка)
  //   // const room = await roomsModel.findById(id); // roomsModel - это ваша модель Rooms
  //   // expect(room).toBeNull(); // Проверяем, что комнаты с таким ID нет

  //   return request(app.getHttpServer())
  //     .delete(`/rooms/delete/${id}`)
  //     .expect(404);
  // });

  // it('DELETE /rooms/delete/:id  should return 200 successful data delete', async () => {
  //   const id = roomId;
  //   return await request(app.getHttpServer())
  //     .delete(`/rooms/delete/${id}`)
  //     .expect(200);
  // });

  afterAll(async () => {
    await app.close(); // Закрываем приложение NestJS
  });
});

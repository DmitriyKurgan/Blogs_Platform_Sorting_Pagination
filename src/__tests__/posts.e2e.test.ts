import request from 'supertest';
import {app} from "../app_settings";
import {BLogType} from "../utils/types";
import {CodeResponsesEnum} from "../utils/utils";
// id:'1',
//     title: 'New Video By Dima',
//     shortDescription: 'Description',
//     content: 'content',
//     blogId: 'blogID',
//     blogName: 'NewBlog',


const dbName = 'back'
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`

describe('/posts', () => {
    let newVideo: BLogType | null = null
  //  const client = new MongoClient(mongoURI)

    beforeAll(async () => {
      //  await client.connect()
        await request(app).delete('/testing/all-data').expect(204)
    })

    afterAll(async () => {
       // await client.close()
    })

    it('GET posts = []', async () => {
        const response = await request(app).get('/posts/')
        console.log(response)
    })

    it('- POST does not create the post with incorrect data', async function () {
        await request(app)
            .post('/posts/')
            .send({ title: '', author: '' })
            .expect(CodeResponsesEnum.Incorrect_values_400, {
                errorsMessages: [
                    { message: 'Invalid value', field: 'title' },
                    { message: 'Invalid value', field: 'author' },
                    { message: 'Invalid value', field: 'availableResolutions' },
                    { message: 'Invalid value', field: 'availableResolutions' },
                    {
                        message: 'Invalid availableResolutions value',
                        field: 'availableResolutions'
                    }
                ]
            })

        const res = await request(app).get('/posts/')
        expect(res.body).toEqual([])
    })

    it('- POST will create the post with correct data', async () => {

        const newVideo: BLogType = {
            id: '123',
            name: 'Dimas Blog',
            description: 'Description of Blog',
            websiteUrl: 'https://leetcode.com',
        };

        await request(app)
            .post('/posts/')
            .send(newVideo)
            .expect(CodeResponsesEnum.Incorrect_values_400, {
                errorsMessages: [
                    { message: 'Invalid value', field: 'title' },
                    { message: 'Invalid value', field: 'author' },
                    { message: 'Invalid value', field: 'availableResolutions' },
                    { message: 'Invalid value', field: 'availableResolutions' },
                    {
                        message: 'Invalid availableResolutions value',
                        field: 'availableResolutions'
                    }
                ]
            })

        const res = await request(app).get('/posts/')
        expect(res.body).toEqual([])
    })

    it('- GET post by ID with incorrect id', async () => {
        await request(app).get('/blogs/:id').expect(404)
    })
    // it('+ GET video by ID with correct id', async () => {
    //     await request(app)
    //         .get('/videos/:' + newVideo?.id)
    //         .expect(200, newVideo)
    // })

    it('- PUT post by ID with incorrect data', async () => {
        await request(app)
            .put('/posts/' + 1223)
            .send({ title: 'title', author: 'title' })
            .expect(CodeResponsesEnum.Not_found_404)

        const res = await request(app).get('/posts/')
        expect(res.body[0]).toEqual(newVideo)
    })

    it('+ PUT post by ID with correct data', async () => {
        await request(app)
            .put('/posts/' + newVideo!.id)
            .send({
                title: 'hello title',
                author: 'hello author',
                publicationDate: '2023-01-12T08:12:39.261Z',
            })
            .expect(CodeResponsesEnum.Not_content_204)

        const res = await request(app).get('/posts/')
        expect(res.body[0]).toEqual({
            ...newVideo,
            title: 'hello title',
            author: 'hello author',
            publicationDate: '2023-01-12T08:12:39.261Z',
        })
        newVideo = res.body[0]
    })

    it('- DELETE post by incorrect ID', async () => {
        await request(app)
            .delete('/posts/876328')
            .expect(CodeResponsesEnum.Not_found_404)

        const res = await request(app).get('/posts/')
        expect(res.body[0]).toEqual(newVideo)
    })
    it('+ DELETE post by correct ID, auth', async () => {
        await request(app)
            .delete('/posts/' + newVideo!.id)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(CodeResponsesEnum.Not_content_204)

        const res = await request(app).get('/posts/')
        expect(res.body.length).toBe(0)
    })
})
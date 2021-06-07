const express = require('express');
const {buildSchema} = require('graphql')
const {graphqlHTTP} = require('express-graphql')
let cursos = require('./course');


const app = express();

//settings
app.set('port',3000)

//Schema
const schema = buildSchema(`

type Course{
    id:ID!
    titulo: String!
    vistas: Int
}

input CourseInput{
    titulo: String!
    vistas: Int

}

type Alert{
    message: String
}

type Query{
    getCourses: [Course]
    getCourse(id: ID!): Course
}

type Mutation{
    addCourse(input: CourseInput): Course
    updateCourse(id: ID! ,input: CourseInput): Course
    deleteCourse(id:ID!): Alert
}

`);

const root = {
    getCourses(){
        return cursos;
    },
    getCourse({ id }){
        console.log(id);
         
        return cursos.find( (cursos=> id == cursos.id))
        //if(cursos == null){
         //   return "Ese curso no esta disponible";
        //} else {
        
        //}  
        
    },
    addCourse({input}){
        const {titulo , vistas} = input;
        const id = String(cursos.length + 1);
        const curso = {id ,titulo, vistas}
        cursos.push(curso);
        return curso;
    },

    updateCourse({id, input }){
         
        const courseIndex= cursos.findIndex((course)=> id === course.id );
        console.log(courseIndex , id );
        
        const curso = cursos[courseIndex];
        console.log(curso);
        const newCourse = Object.assign(curso,input);

        curso[courseIndex]=newCourse;
        return newCourse
      
    },
    deleteCourse({id}){
        cursos = cursos.filter((curso)=> curso.id != id);
        return {
            message: `El curso con id ${id} fue eliminado`
        }
    }

}


app.get('/',(req,res)=>{
res.json(cursos);

});

//midddleware
app.use('/graphql',graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));


app.listen(app.get('port'), () => {

    console.log('Server on' , app.get('port'));
})
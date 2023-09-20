import { model, Schema } from "mongoose";

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minLength: [8,'Title must be 8 Charcter'],
        maxLength: [60,'Title must be less than 60 character'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'description is required'],
        minLength: [16,'description must be 8 Charcter'],
        maxLength: [200,'description must be less than 60 character']
    },
    category: {
        type: String,
        required: [true, 'Category is always required']
    },
    thumbnail: {
        public_id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    },
    lectures: [
        {
            title: String,
            description: String,
            lecture: {
                public_id: {
                    type: String,
                    required: true
                },
                secure_url: {
                    type: String,
                    required: true
                }
            }
        }
    ],
    numberOfLectures: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: String,
    }
},{
    timestamps: true
});

const Course = model('Course', courseSchema);

export default Course;
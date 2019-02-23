
import { Photo } from './photo';

export interface User {
    id: number;
    username: string;
    nickname: string;
    age: number;
    gender: string;
    createDate: Date;
    lastActive: Date;
    picUrl: string;
    city: string;
    country: string;
    interests?: string;
    introduction?: string;
    lookingFor?: string;
    photos?: Photo[];
}

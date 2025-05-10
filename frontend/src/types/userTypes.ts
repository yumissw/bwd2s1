export interface User {
    id: number;
    name: string;
    email: string;

    lastName: string;
  firstName: string;
  patronymic: string;
  gender?: 'male' | 'female' | 'other'; 
  dateOfBirth: Date;
  password: string;
  }
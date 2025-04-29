import React, { useState } from 'react';
import { UserData, FormResponse } from './types/form';
import { createUser, getFormStructure } from './services/api';
import LoginForm from './components/LoginForm';
import DynamicForm from './components/DynamicForm';

function App() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<FormResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleLogin = async (data: UserData) => {
    setIsLoading(true);
    setError(undefined);

    try {
      // Create user
      const createUserResult = await createUser(data);
      
      if (!createUserResult.success) {
        setError(createUserResult.message);
        return;
      }

      // Fetch form structure
      const formStructure = await getFormStructure(data.rollNumber);
      
      // Store user data and form structure
      setUserData(data);
      setFormData(formStructure);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {!userData || !formData ? (
          <LoginForm 
            onLogin={handleLogin} 
            isLoading={isLoading} 
            error={error} 
          />
        ) : (
          <DynamicForm formData={formData} />
        )}
      </div>
    </div>
  );
}

export default App;
interface Fields{
    id: string;  // Make sure it's a string
    title: string;
    description: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    status: 'in progress' | 'completed';
}
export default Fields;
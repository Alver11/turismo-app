import { getCategories, getEvents, getTourist } from './useApi';

const API_KEY = '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'; // Reemplaza con tu clave de OpenAI
const API_URL = 'https://api.openai.com/v1/chat/completions';

export const askAssistant = async (message: string) => {
    try {
        // Obtén las categorías, eventos y lugares turísticos
        //const categories = await getCategories();
        const events = await getEvents();
        //const tourists = await getTourist();

        //console.log('Categorías:', categories);
        //console.log('Eventos:', events);
        //console.log('Lugares turísticos:', tourists);

        // Combina todos los datos en un solo contexto
        const context = [...events].map((item) => ({
            name: item.name,
            address: item.address || '',
            district: item.district?.name || '',
            //description: item.description || '',
            description: item.description?.substring(0, 50) || '',
        }));

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content:
                            'Eres un asistente turístico. Responde basándote únicamente en la lista de lugares, eventos y categorías proporcionados.',
                    },
                    { role: 'user', content: `Datos disponibles: ${JSON.stringify(context)}` },
                    { role: 'user', content: message },
                ],
            }),
        });

        const result = await response.json();

        if (response.ok) {
            return result.choices[0].message.content;
        } else {
            console.error('Error en la respuesta de OpenAI:', result);
            return 'No pude procesar tu solicitud.';
        }
    } catch (error) {
        console.error('Error al interactuar con la API de OpenAI:', error);
        return 'Hubo un problema al procesar tu solicitud.';
    }
};

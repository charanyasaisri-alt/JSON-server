import http from 'http';

const students = [];

const server = http.createServer((req, res) => {
    const { method, url } = req;

    const send = (status, data) => {
        res.writeHead(status, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(data));
    };

    // POST /students
    if (method === 'POST' && url === '/students') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const newStudent = JSON.parse(body);

                students.push(newStudent);

                send(201, {
                    message: 'Student created successfully',
                    student: newStudent
                });

            } catch (error) {
                console.log('Invalid JSON received:', body);

                send(400, {
                    message: 'Invalid JSON',
                    error: error.message
                });
            }
        });

        return;
    }

    // GET /students
    if (method === 'GET' && url === '/students') {
        send(200, students);
        return;
    }

    // GET /students/:id
    if (method === 'GET' && url.startsWith('/students/')) {

        const studentId = parseInt(url.split('/')[2], 10);

        const student = students.find(
            s => s.id === studentId
        );

        if (student) {
            send(200, student);
        } else {
            send(404, {
                message: 'Student not found'
            });
        }

        return;
    }

    // PUT /students/:id
    if (method === 'PUT' && url.startsWith('/students/')) {

        const studentId = parseInt(url.split('/')[2], 10);

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {

            try {
                const updateData = JSON.parse(body);

                const index = students.findIndex(
                    s => s.id === studentId
                );

                if (index === -1) {
                    send(404, {
                        message: 'Student not found'
                    });
                    return;
                }

                students[index] = {
                    ...students[index],
                    ...updateData
                };

                send(200, {
                    message: 'Student updated',
                    student: students[index]
                });

            } catch (error) {

                send(400, {
                    message: 'Invalid JSON',
                    error: error.message
                });

            }
        });

        return;
    }

    // DELETE /students/:id
    if (method === 'DELETE' && url.startsWith('/students/')) {

        const studentId = parseInt(url.split('/')[2], 10);

        const index = students.findIndex(
            s => s.id === studentId
        );

        if (index === -1) {
            send(404, {
                message: 'Student not found'
            });
            return;
        }

        students.splice(index, 1);

        send(200, {
            message: 'Student deleted',
            data: students
        });

        return;
    }

    // Invalid route
    send(404, {
        message: 'Route not found'
    });
});

server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000/');
});
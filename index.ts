import Fastify from 'fastify';
import cors from '@fastify/cors';
import staticFiles from '@fastify/static';
import path from 'path';
import db from './db';
 
const fastify = Fastify({ logger: true });
 
fastify.register(cors, { origin: '*' });
 
fastify.register(staticFiles, {
  root: path.join(__dirname, '../../front'),
  prefix: '/'
});
 
fastify.get('/articles', async (request, reply) => {
  const articles = db.prepare('SELECT * FROM article ORDER BY nom').all();
  return reply.send(articles);
});
 
fastify.post<{ Body: { nom: string; quantite: number } }>(
  '/articles/entree', async (request, reply) => {
    const { nom, quantite } = request.body;
 
    if (!nom || nom.trim() === '') {
      return reply.code(400).send({ erreur: 'Le nom du produit est obligatoire.' });
    }
    if (!quantite || quantite <= 0) {
      return reply.code(400).send({ erreur: 'La quantite doit etre superieure a 0.' });
    }
 
    const date = new Date().toISOString();
 
    const articleExistant = db.prepare(
      'SELECT * FROM article WHERE nom = ?'
    ).get(nom.trim()) as { id: number; nom: string; quantite: number } | undefined;
 
    if (articleExistant) {
      db.prepare(
        'UPDATE article SET quantite = quantite + ? WHERE id = ?'
      ).run(quantite, articleExistant.id);

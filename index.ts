import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Bootstrapper, EVENT_NAMES } from '@crystallize/import-utilities';
import heapdump from 'heapdump';
import { createClient } from '@crystallize/js-api-client';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const crystallizeTokenId = process.env.CRYSTALLIZE_ACCESS_TOKEN_ID ?? "";
const crystallizeAccessTokenSecret = process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET ?? "";
const crystallizeTenantIdentifier = process.env.CRYSTALLIZE_TENANT_IDENTIFIER ?? "";

app.get('/standard/:index', async (req: Request, res: Response) => {
  // const spec = {
  //   items: [
  //     {
  //       externalReference: "prod_4934592345934",
  //       name: "Performance Test",
  //       shape: "test-lr",
  //       vatType: "Norge",
  //       variants: [
  //         {
  //           name: "Performance Test Variant 1",
  //           sku: "performance-test-1691069928650",
  //           stock: {
  //             "warehouse-14": 111,
  //             "warehouse-10": 222,
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // };

  // const bootstrapper: Bootstrapper = new Bootstrapper();

  // bootstrapper.setAccessToken(crystallizeTokenId, crystallizeAccessTokenSecret);
  // bootstrapper.setTenantIdentifier(crystallizeTenantIdentifier);

  // bootstrapper.setSpec(spec);
  // await bootstrapper.start();
  
  const apiClient = createClient({
    tenantIdentifier: crystallizeTenantIdentifier,
    accessTokenId: crystallizeTokenId,
    accessTokenSecret: crystallizeAccessTokenSecret,
  });
  const result = await apiClient.pimApi(
    `mutation updateProductStock {
      product {
        updateStock(productId: "64cbade8545a7f0a5f5a7e5b", sku: "performance-test-1691069928650", stock: 1, stockLocationIdentifier: "warehouse-41") {
          name
          stock
        }
      }
    }`
  );

  res.send(`Standard request no ${req.params.index}`);
});

app.get('/garbage-collection/:index', async (req: Request, res: Response) => {
  res.send(`Garbage collection request no ${req.params.index}`);
  if (global.gc) {
    console.log('Trigger garbage collection.');
    global.gc();
  } else {
    console.warn('No GC hook! Start your program as `node --expose-gc file.js`.');
  }
});

app.get('/memory-dump/:index', async (req: Request, res: Response) => {
  res.send(`Memory dump request no ${req.params.index}`);

  heapdump.writeSnapshot('./memory-dump/' + Date.now() + '.heapsnapshot');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const serviceName = process.argv[2];

if (!serviceName) {
  console.error('Usage: npm run make:service <service-name>');
  console.error('Example: npm run make:service accounts');
  process.exit(1);
}

// Convert kebab-case to camelCase and PascalCase
const camelCase = serviceName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
const PascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
const serviceFolderName = `${serviceName}-service`;

const rootDir = path.join(__dirname, '..');
const appServiceDir = path.join(rootDir, 'apps', serviceFolderName);
const apiGatewayDir = path.join(rootDir, 'apps', 'api-gateway');
const utilsDir = path.join(rootDir, 'utils', 'constants');

// Create service directories
console.log(`📦 Creating microservice: ${serviceFolderName}`);

if (!fs.existsSync(path.join(appServiceDir, 'src'))) {
  fs.mkdirSync(path.join(appServiceDir, 'src'), { recursive: true });
}

// Create MESSAGE_PATTERNS constant file if it doesn't exist
if (!fs.existsSync(utilsDir)) {
  fs.mkdirSync(utilsDir, { recursive: true });
}

let messagePatterns = '';
if (fs.existsSync(path.join(utilsDir, 'MESSAGE_PATTERNS.ts'))) {
  messagePatterns = fs.readFileSync(path.join(utilsDir, 'MESSAGE_PATTERNS.ts'), 'utf-8');
} else {
  messagePatterns = `export const MESSAGE_PATTERNS = {\n`;
}

// Add service message patterns if not already present
if (!messagePatterns.includes(`${camelCase}:`)) {
  const newPatterns = `  ${camelCase}: {\n    CREATE: '${camelCase}.create',\n    FIND_ALL: '${camelCase}.find_all',\n    FIND_ONE: '${camelCase}.find_one',\n    UPDATE: '${camelCase}.update',\n    DELETE: '${camelCase}.delete',\n  },\n`;
  
  if (messagePatterns.includes('};')) {
    messagePatterns = messagePatterns.replace('};', newPatterns + '};');
  } else {
    messagePatterns += newPatterns + '};\n';
  }
  
  fs.writeFileSync(path.join(utilsDir, 'MESSAGE_PATTERNS.ts'), messagePatterns);
  console.log(`✅ Updated MESSAGE_PATTERNS.ts`);
}

// Create main.ts for microservice
const mainTsContent = `import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001,
      },
    },
  );
  await app.listen();
  console.log('${PascalCase} microservice is listening');
}

bootstrap();
`;

fs.writeFileSync(path.join(appServiceDir, 'src', 'main.ts'), mainTsContent);
console.log(`✅ Created ${serviceFolderName}/src/main.ts`);

// Create app.module.ts for microservice (root module)
const appModuleContent = `import { Module } from '@nestjs/common';
import { ${PascalCase}Module } from './${camelCase}/${camelCase}.module';

@Module({
  imports: [${PascalCase}Module],
  controllers: [],
  providers: [],
})
export class AppModule {}
`;

fs.writeFileSync(path.join(appServiceDir, 'src', `app.module.ts`), appModuleContent);
console.log(`✅ Created ${serviceFolderName}/src/app.module.ts (root module)`);

// Create resource structure inside microservice
console.log(`\n📦 Creating default resource: ${serviceName}`);

const resourceDir = path.join(appServiceDir, 'src', camelCase);
const resourceDtoDir = path.join(resourceDir, 'dto');
const resourceEntitiesDir = path.join(resourceDir, 'entities');

fs.mkdirSync(resourceDir, { recursive: true });
fs.mkdirSync(resourceDtoDir, { recursive: true });
fs.mkdirSync(resourceEntitiesDir, { recursive: true });

// Create DTOs for resource
const createDtoContent = `export class Create${PascalCase}Dto {}
`;
fs.writeFileSync(path.join(resourceDtoDir, `create-${serviceName}.dto.ts`), createDtoContent);
console.log(`✅ Created ${serviceFolderName}/src/${camelCase}/dto/create-${serviceName}.dto.ts`);

const updateDtoContent = `import { PartialType } from '@nestjs/mapped-types';
import { Create${PascalCase}Dto } from './create-${serviceName}.dto';

export class Update${PascalCase}Dto extends PartialType(Create${PascalCase}Dto) {}
`;
fs.writeFileSync(path.join(resourceDtoDir, `update-${serviceName}.dto.ts`), updateDtoContent);
console.log(`✅ Created ${serviceFolderName}/src/${camelCase}/dto/update-${serviceName}.dto.ts`);

// Create Entity for resource
const entityContent = `export class ${PascalCase} {}
`;
fs.writeFileSync(path.join(resourceEntitiesDir, `${camelCase}.entity.ts`), entityContent);
console.log(`✅ Created ${serviceFolderName}/src/${camelCase}/entities/${camelCase}.entity.ts`);

// Create Service for resource
const serviceContent = `import { Injectable } from '@nestjs/common';
import { Create${PascalCase}Dto } from './dto/create-${serviceName}.dto';
import { Update${PascalCase}Dto } from './dto/update-${serviceName}.dto';

@Injectable()
export class ${PascalCase}Service {
  create(create${PascalCase}Dto: Create${PascalCase}Dto) {
    return 'This action adds a new ${serviceName}';
  }

  findAll() {
    return \`This action returns all ${serviceName}\`;
  }

  findOne(id: number) {
    return \`This action returns a #\${id} ${serviceName}\`;
  }

  update(id: number, update${PascalCase}Dto: Update${PascalCase}Dto) {
    return \`This action updates a #\${id} ${serviceName}\`;
  }

  remove(id: number) {
    return \`This action removes a #\${id} ${serviceName}\`;
  }
}
`;
fs.writeFileSync(path.join(resourceDir, `${camelCase}.service.ts`), serviceContent);
console.log(`✅ Created ${serviceFolderName}/src/${camelCase}/${camelCase}.service.ts`);

// Create Controller for resource with @MessagePattern
const controllerContent = `import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';
import { ${PascalCase}Service } from './${camelCase}.service';
import { Create${PascalCase}Dto } from './dto/create-${serviceName}.dto';
import { Update${PascalCase}Dto } from './dto/update-${serviceName}.dto';

@Controller()
export class ${PascalCase}Controller {
  constructor(private readonly ${camelCase}Service: ${PascalCase}Service) {}

  @MessagePattern(MESSAGE_PATTERNS.${camelCase}.CREATE)
  create(@Payload() create${PascalCase}Dto: Create${PascalCase}Dto) {
    return this.${camelCase}Service.create(create${PascalCase}Dto);
  }

  @MessagePattern(MESSAGE_PATTERNS.${camelCase}.FIND_ALL)
  findAll() {
    return this.${camelCase}Service.findAll();
  }

  @MessagePattern(MESSAGE_PATTERNS.${camelCase}.FIND_ONE)
  findOne(@Payload() data: any) {
    return this.${camelCase}Service.findOne(data.id);
  }

  @MessagePattern(MESSAGE_PATTERNS.${camelCase}.UPDATE)
  update(@Payload() data: any) {
    return this.${camelCase}Service.update(data.id, data);
  }

  @MessagePattern(MESSAGE_PATTERNS.${camelCase}.DELETE)
  remove(@Payload() data: any) {
    return this.${camelCase}Service.remove(data.id);
  }
}
`;
fs.writeFileSync(path.join(resourceDir, `${camelCase}.controller.ts`), controllerContent);
console.log(`✅ Created ${serviceFolderName}/src/${camelCase}/${camelCase}.controller.ts`);

// Create Controller spec file
const specContent = `import { Test, TestingModule } from '@nestjs/testing';
import { ${PascalCase}Controller } from './${camelCase}.controller';
import { ${PascalCase}Service } from './${camelCase}.service';

describe('${PascalCase}Controller', () => {
  let controller: ${PascalCase}Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [${PascalCase}Controller],
      providers: [${PascalCase}Service],
    }).compile();

    controller = module.get<${PascalCase}Controller>(${PascalCase}Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
`;
fs.writeFileSync(path.join(resourceDir, `${camelCase}.controller.spec.ts`), specContent);
console.log(`✅ Created ${serviceFolderName}/src/${camelCase}/${camelCase}.controller.spec.ts`);

// Create Service spec file
const serviceSpecContent = `import { Test, TestingModule } from '@nestjs/testing';
import { ${PascalCase}Service } from './${camelCase}.service';

describe('${PascalCase}Service', () => {
  let service: ${PascalCase}Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [${PascalCase}Service],
    }).compile();

    service = module.get<${PascalCase}Service>(${PascalCase}Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
`;
fs.writeFileSync(path.join(resourceDir, `${camelCase}.service.spec.ts`), serviceSpecContent);
console.log(`✅ Created ${serviceFolderName}/src/${camelCase}/${camelCase}.service.spec.ts`);

// Create Resource Module
const resourceModuleContent = `import { Module } from '@nestjs/common';
import { ${PascalCase}Service } from './${camelCase}.service';
import { ${PascalCase}Controller } from './${camelCase}.controller';

@Module({
  controllers: [${PascalCase}Controller],
  providers: [${PascalCase}Service],
})
export class ${PascalCase}Module {}
`;
fs.writeFileSync(path.join(resourceDir, `${camelCase}.module.ts`), resourceModuleContent);
console.log(`✅ Created ${serviceFolderName}/src/${camelCase}/${camelCase}.module.ts`);

// Update root module to import resource module
updateRootModule(appModuleContent, PascalCase, camelCase, appServiceDir);

// Create API Gateway service structure
console.log(`\n🚀 Creating API Gateway proxy: ${serviceName}`);

const apiGatewayServiceDir = path.join(apiGatewayDir, camelCase);
if (!fs.existsSync(apiGatewayServiceDir)) {
  fs.mkdirSync(apiGatewayServiceDir, { recursive: true });
}

// Create controller for API Gateway (simple proxy, no DTOs)
const gatewayControllerContent = `import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';

@Controller('${serviceName}')
export class ${PascalCase}Controller {
  constructor(
    @Inject('${camelCase.toUpperCase()}_SERVICE') private client: ClientProxy,
  ) {}

  @Post()
  create(@Body() data: any) {
    return this.client.send(
      MESSAGE_PATTERNS.${camelCase}.CREATE,
      data,
    );
  }

  @Get()
  findAll() {
    return this.client.send(MESSAGE_PATTERNS.${camelCase}.FIND_ALL, {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send(MESSAGE_PATTERNS.${camelCase}.FIND_ONE, { id });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.client.send(MESSAGE_PATTERNS.${camelCase}.UPDATE, {
      id,
      ...data,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.client.send(MESSAGE_PATTERNS.${camelCase}.DELETE, { id });
  }
}
`;
fs.writeFileSync(path.join(apiGatewayServiceDir, `${camelCase}.controller.ts`), gatewayControllerContent);
console.log(`✅ Created api-gateway/${camelCase}/${camelCase}.controller.ts`);

// Create service for API Gateway
const gatewayServiceContent = `import { Injectable } from '@nestjs/common';

@Injectable()
export class ${PascalCase}Service {}
`;
fs.writeFileSync(path.join(apiGatewayServiceDir, `${camelCase}.service.ts`), gatewayServiceContent);
console.log(`✅ Created api-gateway/${camelCase}/${camelCase}.service.ts`);

// Create module
const moduleContent = `import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ${PascalCase}Controller } from './${camelCase}.controller';
import { ${PascalCase}Service } from './${camelCase}.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: '${camelCase.toUpperCase()}_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [${PascalCase}Controller],
  providers: [${PascalCase}Service],
})
export class ${PascalCase}Module {}
`;
fs.writeFileSync(path.join(apiGatewayServiceDir, `${camelCase}.module.ts`), moduleContent);
console.log(`✅ Created api-gateway/src/${camelCase}/${camelCase}.module.ts`);

// Update API Gateway main module
console.log(`\n🔗 Linking to API Gateway module...`);
updateApiGatewayModule(serviceName, PascalCase, camelCase, apiGatewayDir);

console.log(`\n✨ Service "${serviceFolderName}" created successfully!`);
console.log(`
📋 Structure created:
   apps/${serviceFolderName}/
   ├── src/
   │   ├── main.ts (microservice entry)
   │   ├── ${camelCase}.module.ts (root module - imports resources)
   │   └── ${camelCase}/ (default resource)
   │       ├── ${camelCase}.controller.ts (@MessagePattern handlers)
   │       ├── ${camelCase}.service.ts (business logic)
   │       ├── ${camelCase}.module.ts (resource module)
   │       ├── dto/
   │       │   ├── create-${serviceName}.dto.ts
   │       │   └── update-${serviceName}.dto.ts
   │       ├── entities/
   │       │   └── ${camelCase}.entity.ts
   │       ├── ${camelCase}.controller.spec.ts
   │       └── ${camelCase}.service.spec.ts

   apps/api-gateway/
   ├── ${camelCase}/ (API Gateway proxy)
   │   ├── ${camelCase}.controller.ts (REST routes → microservice)
   │   └── ${camelCase}.module.ts (microservice client config)

📋 Message Patterns:
• Auto-generated in utils/constants/MESSAGE_PATTERNS.ts
• Controller uses @MessagePattern() decorators
• API Gateway forwards to microservice via ClientProxy

📋 Workflow:
1. REST Request → API Gateway Controller
2. API Gateway sends via ClientProxy (MESSAGE_PATTERNS)
3. Microservice Controller receives @MessagePattern()
4. Service handles business logic + validation

📋 To generate more resources:
   nest g controller <resource-name> --path apps/${serviceFolderName}/src
   nest g service <resource-name> --path apps/${serviceFolderName}/src
   
Then add corresponding @MessagePattern handlers.

📋 Start services:
   # Terminal 1: Microservice
   cd apps/${serviceFolderName} && npm start
   
   # Terminal 2: API Gateway
   npm run start:api-gateway
`);

function updateRootModule(appModuleContent, PascalCase, camelCase, appServiceDir) {
  // This function is called but the module is already created with imports
  // No additional update needed here
}

function updateApiGatewayModule(serviceName, PascalCase, camelCase, apiGatewayDir) {
  const modulePath = path.join(apiGatewayDir, 'api-gateway.module.ts');
  
  if (!fs.existsSync(modulePath)) {
    console.warn(`⚠️  api-gateway.module.ts not found at expected location`);
    return;
  }

  let moduleContent = fs.readFileSync(modulePath, 'utf-8');

  // Check if module is already imported
  if (moduleContent.includes(`${PascalCase}Module`)) {
    console.log(`✅ ${PascalCase}Module already imported`);
    return;
  }

  // Add import statement
  const importStatement = `import { ${PascalCase}Module } from './${camelCase}/${camelCase}.module';`;
  if (!moduleContent.includes(importStatement)) {
    const importRegex = /(import\s*{[^}]*}\s*from\s*['"][^'"]*['"];?)/;
    const lastImport = moduleContent.lastIndexOf("import");
    const endOfLastImport = moduleContent.indexOf(';', lastImport) + 1;
    moduleContent = moduleContent.slice(0, endOfLastImport) + '\n' + importStatement + moduleContent.slice(endOfLastImport);
  }

  // Add to imports array in @Module decorator
  const importsArrayRegex = /imports:\s*\[([\s\S]*?)\]/;
  const match = moduleContent.match(importsArrayRegex);
  
  if (match) {
    const importsArray = match[1];
    if (!importsArray.includes(`${PascalCase}Module`)) {
      const newImportsArray = importsArray.replace(/\]/, `,\n    ${PascalCase}Module,\n  `);
      moduleContent = moduleContent.replace(importsArrayRegex, `imports: [${newImportsArray}`);
      fs.writeFileSync(modulePath, moduleContent);
      console.log(`✅ Updated api-gateway.module.ts with ${PascalCase}Module import`);
    }
  }
}

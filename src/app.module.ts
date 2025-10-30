import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/dbConfig';
import { BeaconModule } from './modules/beacon.module';
import { EmployeeAndServiceModule } from './modules/employeeAndSupervisor.module';
import { TeamsModule } from './modules/teams.module';
import { VehicleModule } from './modules/vehicle.module';
import { ZoneModule } from './modules/zone.module';
import { RegistrosModule } from './modules/registros.module';
import { VisitFormModule } from './modules/visitForm.module';
import { WorkOrdersModule } from './modules/workOrders.module';
import { SuperFormModule } from './modules/superForm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig
    }),
    BeaconModule,
    EmployeeAndServiceModule,
    TeamsModule,
    VehicleModule,
    ZoneModule,
    RegistrosModule,
    VisitFormModule,
    WorkOrdersModule,
    SuperFormModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

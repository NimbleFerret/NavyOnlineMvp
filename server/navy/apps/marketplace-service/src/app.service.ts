import { Project, ProjectDocument } from '@app/shared-library/schemas/marketplace/schema.project';
import { Collection, CollectionDocument } from '@app/shared-library/schemas/marketplace/schema.collection';
import { CollectionItem, CollectionItemDocument } from '@app/shared-library/schemas/marketplace/schema.collection.item';
import { Mint, MintDocument } from '@app/shared-library/schemas/marketplace/schema.mint';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Faq, FaqDocument } from '@app/shared-library/schemas/marketplace/schema.faq';
import { FixtureLoader } from './app.fixture.loader';
import { Favourite, FavouriteDocument } from '@app/shared-library/schemas/marketplace/schema.favourite';

@Injectable()
export class AppService implements OnModuleInit {

  public static readonly DefaultPaginationSize = 24;

  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Mint.name) private mintModel: Model<MintDocument>,
    @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>,
    @InjectModel(CollectionItem.name) private collectionItemModel: Model<CollectionItemDocument>,
    @InjectModel(Faq.name) private faqModel: Model<FaqDocument>,
    @InjectModel(Favourite.name) private favouriteModel: Model<FavouriteDocument>) {
  }

  async onModuleInit() {
    const fixtureLoader = new FixtureLoader(this.projectModel, this.collectionModel, this.mintModel, this.collectionItemModel, this.faqModel, this.favouriteModel);
    await fixtureLoader.loadFixtures();
  }

}

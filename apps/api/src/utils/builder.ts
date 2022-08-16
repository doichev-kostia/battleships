import { Base } from "utils/entities/base.entity";
import { EntityManager, MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { ClassType } from "@panenco/papi";
import { DeepPartial } from "utils/types";

export class Builder<TEntity extends Base<any>> {
	private rangeStart: number;
	private rangeEnd: number;
	private orm: MikroORM<PostgreSqlDriver>;

	private constructor(private entityType: ClassType<TEntity>, private list: TEntity[]) {
		this.rangeStart = 0;
		this.rangeEnd = list.length;
	}

	public static list<TEntity extends Base<any>>(
		entityType: ClassType<TEntity>,
		size: number,
	): Builder<TEntity> {
		return new Builder<TEntity>(
			entityType,
			[...Array(size)].map(() => ({} as any)),
		);
	}

	public with(
		object: DeepPartial<TEntity> | ((i: number, list: TEntity[]) => DeepPartial<TEntity>),
	): Builder<TEntity> {
		this.list.slice(this.rangeStart, this.rangeEnd).forEach((item, i) => {
			let currentObject = object;
			if (object instanceof Function) {
				currentObject = object(i, this.list);
			}

			Object.keys(currentObject).forEach((key) => {
				item[key] = currentObject[key];
			});
		});
		return this;
	}

	public first(length = 1): this {
		this.rangeEnd = length;
		this.rangeStart = 0;
		return this;
	}

	public last(length = 1): this {
		this.rangeEnd = this.list.length;
		this.rangeStart = this.list.length - length;
		return this;
	}

	public next(length = 1): this {
		this.rangeStart = this.rangeEnd;
		this.rangeEnd = this.rangeEnd + length;
		return this;
	}

	public currentFirst(length = 1): this {
		this.rangeEnd = this.rangeStart + length;
		return this;
	}

	public build(em: EntityManager): TEntity[] {
		const entities = this.list.map((item) => em.create(this.entityType, item));
		em.persist(Object.values(entities));
		return entities;
	}
}

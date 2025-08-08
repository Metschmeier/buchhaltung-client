import { Directive, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Directive()
export abstract class BaseCrudTableComponent<T> implements AfterViewInit {
    displayedColumns: string[] = [];

    dataSource = new MatTableDataSource<T>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    // Wird von der Kind-Komponente überschrieben/implementiert
    abstract loadData(): void;

    updateTableFrom(data: T[]): void {
        this.dataSource.data = data;
    }

    editItem(item: T): void {
        this.onEdit(item);
    }

    deleteItem(id: number): void {
        this.onDelete(id)
    }


    // Diese Methoden müssen von der Kindklasse definiert werden
    protected abstract onEdit(item: T): void;
    protected abstract onDelete(id: number): void;
}
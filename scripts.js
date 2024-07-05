const canvas = document.getElementById('sortCanvas');
const ctx = canvas.getContext('2d');
const SCREEN_WIDTH = 1000;
const SCREEN_HEIGHT = 550;
const ARR_SIZE = 130;
const RECT_SIZE = 7;
let arr = new Array(ARR_SIZE);
let baseArr = new Array(ARR_SIZE);
let comparingIndex1 = -1;
let comparingIndex2 = -1;
let sortedIndex = -1;
let complete = false;
let sorting = false;

document.getElementById('startButton').addEventListener('click', () => startSorting(document.getElementById('sortMethod').value));
document.getElementById('stopButton').addEventListener('click', stopSorting);

function randomizeArray() {
    for (let i = 0; i < ARR_SIZE; i++) {
        baseArr[i] = Math.floor(Math.random() * SCREEN_HEIGHT);
    }
    loadArray();
}

function loadArray() {
    arr = [...baseArr];
    comparingIndex1 = -1;
    comparingIndex2 = -1;
    sortedIndex = -1;
    drawArray();
}

function drawArray() {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    for (let i = 0; i < arr.length; i++) {
        ctx.fillStyle = (i === comparingIndex1 || i === comparingIndex2) ? 'red' : (i <= sortedIndex) ? 'green' : 'gray';
        ctx.fillRect(i * RECT_SIZE, SCREEN_HEIGHT - arr[i], RECT_SIZE, arr[i]);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function stopSorting() {
    sorting = false;
}

async function startSorting(type) {
    loadArray();
    complete = false;
    sorting = true;

    switch (type) {
        case 'selection':
            await selectionSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'bubble':
            await bubbleSort();
            break;
        case 'merge':
            await mergeSort(arr, 0, arr.length - 1);
            break;
        case 'quick':
            await quickSort(arr, 0, arr.length - 1);
            break;
        case 'heap':
            await heapSort();
            break;
        default:
            console.error('Invalid sorting type');
    }

    complete = true;
    drawArray();
}

async function selectionSort() {
    for (let i = 0; i < arr.length - 1 && sorting; i++) {
        let minIndex = i;
        for (let j = i + 1; j < arr.length && sorting; j++) {
            comparingIndex1 = j;
            drawArray();
            await delay(5);

            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }

        if (minIndex !== i) {
            let temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
        sortedIndex = i;
        drawArray();
    }
}

async function insertionSort() {
    for (let i = 1; i < arr.length && sorting; i++) {
        let key = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > key && sorting) {
            arr[j + 1] = arr[j];
            j--;
            comparingIndex1 = j + 1;
            drawArray();
            await delay(5);
        }
        arr[j + 1] = key;
        sortedIndex = i;
        drawArray();
    }
}

async function bubbleSort() {
    for (let i = 0; i < arr.length - 1 && sorting; i++) {
        for (let j = 0; j < arr.length - i - 1 && sorting; j++) {
            comparingIndex1 = j;
            comparingIndex2 = j + 1;
            drawArray();
            await delay(5);

            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
        sortedIndex = arr.length - i - 1;
        drawArray();
    }
}

async function mergeSort(array, l, r) {
    if (l >= r || !sorting) return;

    const m = Math.floor((l + r) / 2);
    await mergeSort(array, l, m);
    await mergeSort(array, m + 1, r);

    let n1 = m - l + 1;
    let n2 = r - m;
    let left = array.slice(l, m + 1);
    let right = array.slice(m + 1, r + 1);

    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2 && sorting) {
        comparingIndex1 = k;
        if (left[i] <= right[j]) {
            array[k++] = left[i++];
        } else {
            array[k++] = right[j++];
        }
        drawArray();
        await delay(5);
    }

    while (i < n1 && sorting) {
        comparingIndex1 = k;
        array[k++] = left[i++];
        drawArray();
        await delay(5);
    }

    while (j < n2 && sorting) {
        comparingIndex1 = k;
        array[k++] = right[j++];
        drawArray();
        await delay(5);
    }

    for (let i = l; i <= r; i++) {
        sortedIndex = i;
    }
}

async function quickSort(array, low, high) {
    if (low >= high || !sorting) return;

    const pi = await partition(array, low, high);
    await quickSort(array, low, pi - 1);
    await quickSort(array, pi + 1, high);
}

async function partition(array, low, high) {
    let pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high && sorting; j++) {
        comparingIndex1 = j;
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            drawArray();
            await delay(5);
        }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    sortedIndex = i + 1;
    drawArray();
    await delay(5);
    return i + 1;
}

async function heapSort() {
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0 && sorting; i--) {
        await heapify(arr, arr.length, i);
    }

    for (let i = arr.length - 1; i > 0 && sorting; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        sortedIndex = i;
        drawArray();
        await delay(5);
        await heapify(arr, i, 0);
    }
    sortedIndex = 0;
    drawArray();
}

async function heapify(array, n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && array[left] > array[largest]) {
        largest = left;
    }

    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== i && sorting) {
        [array[i], array[largest]] = [array[largest], array[i]];
        comparingIndex1 = i;
        comparingIndex2 = largest;
        drawArray();
        await delay(5);
        await heapify(array, n, largest);
    }
}

randomizeArray();

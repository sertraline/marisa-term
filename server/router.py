from fastapi import APIRouter, Request
from api.controllers.TermController import TermController
import config


router = APIRouter()
controller = TermController(config)


@router.get('/')
async def index(request: Request):
    return await controller.index(request)


@router.post('/encode')
async def encode(request: Request):
    return await controller.encode(request)


@router.post('/decode')
async def encode(request: Request):
    return await controller.decode(request)


@router.post('/convert')
async def encode(request: Request):
    return await controller.convert(request)


@router.post('/host')
async def encode(request: Request):
    return await controller.host(request)


@router.post('/weather')
async def encode(request: Request):
    return await controller.weather(request)


@router.post('/fetch')
async def content(request: Request):
    return await controller.fetch(request)


@router.get('/fs')
async def filesystem(request: Request):
    return await controller.filesystem(request)
